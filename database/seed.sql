-- Example values; edit to fit the project.

BEGIN;

INSERT INTO public.keyword_kinds (name, match_points) VALUES

('item_type', 20),

('color', 10)

ON CONFLICT (name) DO NOTHING;

INSERT INTO public.keywords (kind_id, name)

SELECT k.id, v.name

FROM public.keyword_kinds k

JOIN (VALUES

('item_type', 'wallet'),

('item_type', 'keys'),

('item_type', 'phone'),

('item_type', 'headphones'),

('item_type', 'student ID card'),

('item_type', 'backpack'),

('item_type', 'jacket'),

('color', 'black'),

('color', 'white'),

('color', 'grey'),

('color', 'red'),

('color', 'blue'),

('color', 'green'),

('color', 'yellow'),

('color', 'brown')

) AS v (kind, name) ON v.kind = k.name

ON CONFLICT (kind_id, name) DO NOTHING;

COMMIT;
