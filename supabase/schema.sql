-- DiscoMatch schema — correr en Supabase SQL Editor

create table dm_users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  age int,
  bio text,
  photo_url text,
  interests text[] default '{}',
  created_at timestamptz default now()
);

create table dm_events (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  date date not null default current_date,
  active boolean default true,
  created_at timestamptz default now()
);

create table dm_checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references dm_users(id) on delete cascade,
  event_id uuid references dm_events(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, event_id)
);

create table dm_swipes (
  id uuid default gen_random_uuid() primary key,
  from_user uuid references dm_users(id) on delete cascade,
  to_user uuid references dm_users(id) on delete cascade,
  event_id uuid references dm_events(id) on delete cascade,
  direction text check (direction in ('like', 'pass')),
  created_at timestamptz default now(),
  unique(from_user, to_user, event_id)
);

create table dm_matches (
  id uuid default gen_random_uuid() primary key,
  user_a uuid references dm_users(id) on delete cascade,
  user_b uuid references dm_users(id) on delete cascade,
  event_id uuid references dm_events(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_a, user_b, event_id)
);

-- RLS: open para POC (anon puede leer y escribir)
alter table dm_users enable row level security;
alter table dm_events enable row level security;
alter table dm_checkins enable row level security;
alter table dm_swipes enable row level security;
alter table dm_matches enable row level security;

create policy "dm_users open" on dm_users for all to anon using (true) with check (true);
create policy "dm_events open" on dm_events for all to anon using (true) with check (true);
create policy "dm_checkins open" on dm_checkins for all to anon using (true) with check (true);
create policy "dm_swipes open" on dm_swipes for all to anon using (true) with check (true);
create policy "dm_matches open" on dm_matches for all to anon using (true) with check (true);

-- Evento de prueba
insert into dm_events (name, date, active)
values ('Apertura del local', current_date, true);

-- Perfiles de prueba (con foto de pravatar)
insert into dm_users (email, name, age, bio, photo_url, interests) values
('valentina@disco.test', 'Valentina', 24, 'Reggaetón, mate y noches que no terminan 🔥', 'https://i.pravatar.cc/600?img=47', array['Bailar','Música','Arte']),
('lucia@disco.test',     'Lucía',     22, 'Estudiante de diseño. Salgo los viernes a desconectar 🎨', 'https://i.pravatar.cc/600?img=44', array['Diseño','Fotografía','Café']),
('camila@disco.test',    'Camila',    26, 'Buen trago y buena música. Acá por pasar una buena noche ✨', 'https://i.pravatar.cc/600?img=32', array['Cócteles','Electrónica','Viajes']),
('martina@disco.test',   'Martina',   23, 'Psicóloga de día, bailarina de noche 🌙', 'https://i.pravatar.cc/600?img=25', array['Psicología','Baile','Lecturas']),
('sofia@disco.test',     'Sofía',     27, 'Arquitecta, Jazz y vino tinto. También me sé todos los temas de Duki 🎵', 'https://i.pravatar.cc/600?img=20', array['Arquitectura','Jazz','Vino']),
('florencia@disco.test', 'Florencia', 25, 'Marketing de día, fiesta de noche 🍸', 'https://i.pravatar.cc/600?img=9', array['Marketing','Moda','Cócteles']),
('isabella@disco.test',  'Isabella',  28, 'Médica residente buscando desconectar 💫', 'https://i.pravatar.cc/600?img=49', array['Medicina','Yoga','Gastronomía']),
('julieta@disco.test',   'Julieta',   22, 'Trap, sushi y conversaciones profundas a las 3AM 🌃', 'https://i.pravatar.cc/600?img=16', array['Trap','Sushi','Filosofía']);

-- Checkin de todos los perfiles de prueba al evento
insert into dm_checkins (user_id, event_id)
select u.id, e.id
from dm_users u, dm_events e
where u.email like '%@disco.test' and e.active = true;
