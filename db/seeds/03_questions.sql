-- questions table seeds here

--question.id 1 - 5, quiz_id = 1
INSERT INTO questions (quiz_id, prompt) VALUES
(1, 'Which city is the Capital of China?'),
(1, 'Which city is the capital of India?'),
(1, 'Which city is the capital of Japan?'),
(1, 'Which city is the capital of the Democratic Republic of Congo?'),
(1, 'Which city is the capital of Russia?');

--question.id 6 - 10, quiz_id = 2
INSERT INTO questions (quiz_id, prompt) VALUES
(2, '2 + 2 = ?'), --4
(2, '169 + 37 = ?'), --206
(2, '34 - 60 = ?'), -- -26
(2, '2 x 2 x 2 x 2 = ?'), --16
(2, '27 / 3 = ?'); --9

--question.id 11 - 15, quiz_id = 3
INSERT INTO questions (quiz_id, prompt) VALUES
(3, 'What colour is Polar Bear fur?'), --colourless
(3, 'How many bones are in a Girrafes neck?'), -- 7
(3, 'Which animal is the largest land mammal in North America?'), -- Bison
(3, 'How much did the heaviest Giant Tortoise weigh?'), --250kg
(3, 'From how far away can the roar of a Lion be heard?'); --5 km