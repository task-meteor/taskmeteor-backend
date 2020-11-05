CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" varchar(64),
	"email" varchar(64) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"info" TEXT(255),
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "periods" (
	"period_id" serial NOT NULL,
	"user" uuid NOT NULL,
	"start" TIMESTAMP NOT NULL,
	"length" integer NOT NULL,
	"info" TEXT,
	CONSTRAINT "periods_pk" PRIMARY KEY ("period_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "tasks" (
	"task_id" serial NOT NULL,
	"user" uuid NOT NULL,
	"name" varchar(128) NOT NULL,
	"status" BOOLEAN NOT NULL,
	"date" TIMESTAMP NOT NULL,
	CONSTRAINT "tasks_pk" PRIMARY KEY ("task_id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "periods" ADD CONSTRAINT "periods_fk0" FOREIGN KEY ("user") REFERENCES "users"("id");

ALTER TABLE "tasks" ADD CONSTRAINT "tasks_fk0" FOREIGN KEY ("user") REFERENCES "users"("id");
