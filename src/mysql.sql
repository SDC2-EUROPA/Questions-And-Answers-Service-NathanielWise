CREATE TABLE questions (
  id INT unsigned NOT NULL,
  product_id INT unsigned NOT NULL,
  body VARCHAR(255) NOT NULL,
  date_written BIGINT unsigned NOT NULL,
  asker_name VARCHAR(63) NOT NULL,
  asker_email VARCHAR(63) NOT NULL,
  reported BOOLEAN NOT NULL,
  helpful INT unsigned NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE answers (
  id INT unsigned NOT NULL,
  question_id INT unsigned NOT NULL,
  body VARCHAR(255) NOT NULL,
  date_written BIGINT unsigned NOT NULL,
  answerer_name VARCHAR(63) NOT NULL,
  answerer_email VARCHAR(63),
  reported BOOLEAN NOT NULL,
  helpful INT unsigned NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE answers_photos (
  id INT unsigned NOT NULL,
  answer_id INT unsigned NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (answer_id) REFERENCES answers(id)
);