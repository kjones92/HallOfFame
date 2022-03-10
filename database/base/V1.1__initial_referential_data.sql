insert into role(description) values ('Administrator');

insert into review_status(description) values ('Pending');
insert into review_status(description) values ('Approved');

-- Hello1234!
INSERT INTO user (username, email, password, role_id) VALUES ('root', 'root@qub.ac.uk', '$2y$10$SCBupmwcl3x8klzkvOh.TeQ6pOghIGpkBx5Soprml2Coten.mTGey', 1)