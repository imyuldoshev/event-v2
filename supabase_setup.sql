-- OPERATION: LAB-09 — Supabase schema for multi-device team sync
-- Run this once in Supabase SQL Editor.

create table if not exists team_state (
  team_id      int primary key,
  team_name    text not null,
  score        int not null default 0,
  hints_used   int not null default 0,
  started_at   timestamptz,
  fused        boolean not null default false,
  finished     boolean not null default false,
  final_outcome text,
  solved_a     boolean[] not null default '{false,false,false}',
  solved_b     boolean[] not null default '{false,false,false}',
  solved_c     boolean[] not null default '{false,false,false}',
  hint_a       boolean[] not null default '{false,false,false}',
  hint_b       boolean[] not null default '{false,false,false}',
  hint_c       boolean[] not null default '{false,false,false}',
  updated_at   timestamptz not null default now()
);

alter table team_state enable row level security;

drop policy if exists "public read" on team_state;
drop policy if exists "public insert" on team_state;
drop policy if exists "public update" on team_state;

create policy "public read"   on team_state for select using (true);
create policy "public insert" on team_state for insert with check (true);
create policy "public update" on team_state for update using (true);

-- Atomic: mark one mission stage solved + award points (1-based stage index)
create or replace function solve_mission(p_team_id int, p_role text, p_stage int, p_points int)
returns void as $$
begin
  if p_role = 'A' then
    update team_state set solved_a[p_stage] = true, score = score + p_points, updated_at = now()
    where team_id = p_team_id and solved_a[p_stage] is distinct from true;
  elsif p_role = 'B' then
    update team_state set solved_b[p_stage] = true, score = score + p_points, updated_at = now()
    where team_id = p_team_id and solved_b[p_stage] is distinct from true;
  else
    update team_state set solved_c[p_stage] = true, score = score + p_points, updated_at = now()
    where team_id = p_team_id and solved_c[p_stage] is distinct from true;
  end if;
end;
$$ language plpgsql;

-- Atomic: use a hint (1-based stage index), -20 points, +1 hint counter
create or replace function use_hint(p_team_id int, p_role text, p_stage int)
returns void as $$
begin
  if p_role = 'A' then
    update team_state set hint_a[p_stage] = true, score = greatest(0, score - 20), hints_used = hints_used + 1, updated_at = now()
    where team_id = p_team_id and hint_a[p_stage] is distinct from true;
  elsif p_role = 'B' then
    update team_state set hint_b[p_stage] = true, score = greatest(0, score - 20), hints_used = hints_used + 1, updated_at = now()
    where team_id = p_team_id and hint_b[p_stage] is distinct from true;
  else
    update team_state set hint_c[p_stage] = true, score = greatest(0, score - 20), hints_used = hints_used + 1, updated_at = now()
    where team_id = p_team_id and hint_c[p_stage] is distinct from true;
  end if;
end;
$$ language plpgsql;

-- Atomic: fusion bonus, awarded once
create or replace function fuse_team(p_team_id int)
returns void as $$
begin
  update team_state set fused = true, score = score + 150, updated_at = now()
  where team_id = p_team_id and fused = false;
end;
$$ language plpgsql;

-- Atomic: finish the mission (success or timeout), awarded once
create or replace function finish_team(p_team_id int, p_outcome text, p_points int)
returns void as $$
begin
  update team_state set finished = true, final_outcome = p_outcome, score = score + p_points, updated_at = now()
  where team_id = p_team_id and finished = false;
end;
$$ language plpgsql;

-- Atomic: start the shared 25-minute timer, set once by whichever agent deploys first
create or replace function start_timer(p_team_id int)
returns void as $$
begin
  update team_state set started_at = now(), updated_at = now()
  where team_id = p_team_id and started_at is null;
end;
$$ language plpgsql;

-- Enable realtime change broadcasts for this table
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'team_state'
  ) then
    alter publication supabase_realtime add table team_state;
  end if;
end $$;
