SELECT quizzes.id AS id,
users.name AS creator,
title,
description
FROM quizzes
JOIN users ON owner_id = users.id
WHERE is_public IS TRUE AND is_active IS TRUE AND owner_id = 1;
