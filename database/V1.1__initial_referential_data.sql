insert into role(description) values ('Administrator');
insert into role(description) values ('Member');

insert into review_status(description) values ('Pending');
insert into review_status(description) values ('Approved');
insert into review_status(description) values ('Rejected');

-- Hello1234!
INSERT INTO user (username, email, password, role_id) VALUES ('root', 'root@qub.ac.uk', '$2y$10$SCBupmwcl3x8klzkvOh.TeQ6pOghIGpkBx5Soprml2Coten.mTGey', 1);
INSERT INTO user (username, email, password, role_id) VALUES ('member', 'member@qub.ac.uk', '$2y$10$SCBupmwcl3x8klzkvOh.TeQ6pOghIGpkBx5Soprml2Coten.mTGey', 2);