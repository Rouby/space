insert into space.race 
    (id, name)
  values
    ('8c964c74-01e7-11eb-aa07-d3e60b9e2050', 'Human');


------

INSERT INTO "space"."person"("id","name")
VALUES
(E'7c21ea8e-01e6-11eb-802e-dfc26b9c462f',E'Rouby');
INSERT INTO "space_private"."account"("person_id","email","password_hash")
VALUES
(E'7c21ea8e-01e6-11eb-802e-dfc26b9c462f',E'jonathan.burke.1311@googlemail.com',E'$2a$06$q.JKrcwIWDZIDPnp6gT2Re8DKLRidHRhbuFlwiainCswjEcpI2Pu2');


INSERT INTO "space"."game"("id","name","author_id","player_slots","type","size","started")
VALUES
(E'82ec5610-01e6-11eb-a6ef-bf0fd0e42c9f',E'New Game',E'7c21ea8e-01e6-11eb-802e-dfc26b9c462f',6,E'spiral',E'normal',NULL);
INSERT INTO "space"."player"("game_id","person_id","race_id")
VALUES
(E'82ec5610-01e6-11eb-a6ef-bf0fd0e42c9f',E'7c21ea8e-01e6-11eb-802e-dfc26b9c462f',E'8c964c74-01e7-11eb-aa07-d3e60b9e2050');
