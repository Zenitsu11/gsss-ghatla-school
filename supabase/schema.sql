-- Run this whole file once in Supabase Dashboard → SQL Editor.
create table if not exists public.site_content (
  id integer primary key check (id = 1),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- There is intentionally no public policy. The website reads and writes through
-- protected server routes using the service-role key, which never reaches a browser.

insert into public.site_content (id, content)
values (1, '{"schoolName":"राजकीय उच्च माध्यमिक विद्यालय, घातला","location":"घातला, राजस्थान","udise":"विद्यालय यू-डाइस कोड: अद्यतन किया जाना है","principal":"प्रधानाचार्य महोदय","phone":"विद्यालय कार्यालय से संपर्क करें","email":"admin@gsssghatla.edu.in","address":"राजकीय उच्च माध्यमिक विद्यालय, घातला, राजस्थान","about":"राजकीय उच्च माध्यमिक विद्यालय, घातला विद्यार्थियों को गुणवत्तापूर्ण, समावेशी एवं संस्कारयुक्त शिक्षा प्रदान करने के लिए प्रतिबद्ध है।","principalMessage":"हमारा प्रयास है कि प्रत्येक विद्यार्थी अपनी क्षमता को पहचाने और नैतिक मूल्यों के साथ आगे बढ़े।","admissionText":"नवीन प्रवेश के लिए विद्यालय कार्यालय से संपर्क करें।","notices":[{"id":"1","title":"सत्र 2026–27 हेतु नवीन प्रवेश संबंधी सूचना","date":"29 अगस्त 2026","important":true}],"activities":["प्रार्थना सभा एवं नैतिक शिक्षा","खेलकूद एवं योग गतिविधियाँ"],"gallery":[]}')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('school-media', 'school-media', true)
on conflict (id) do update set public = true;

-- No browser can upload directly. The admin-only server route uses the service role.
