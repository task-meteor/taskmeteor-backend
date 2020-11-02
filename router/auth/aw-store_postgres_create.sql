CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" TEXT(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" TEXT(255) NOT NULL,
	"fb_auth" varchar(128),
	"g_auth" varchar(128),
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "orders" (
	"order_id" serial NOT NULL,
	"order_num" integer NOT NULL,
	"user" integer NOT NULL,
	"status" varchar(128) NOT NULL,
	"tracking" varchar(64),
	"date_conf" varchar(32),
	"date_est" varchar(32),
	CONSTRAINT "orders_pk" PRIMARY KEY ("order_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "products" (
	"product_id" serial NOT NULL,
	"category" integer NOT NULL,
	"brand" integer NOT NULL,
	"name" varchar(128) NOT NULL,
	"price" integer,
	"parameters" integer NOT NULL,
	"description" TEXT,
	"type" TEXT NOT NULL,
	"data1" TEXT NOT NULL,
	"data2" TEXT,
	"data3" TEXT,
	"data4" TEXT,
	"data5" TEXT,
	CONSTRAINT "products_pk" PRIMARY KEY ("product_id")
) WITH (
	OIDS=FALSE
);



CREATE TABLE "reviews" (
	"review_id" serial NOT NULL,
	"product_id" integer NOT NULL,
	"name" varchar(32) NOT NULL,
	"title" varchar(64) NOT NULL,
	"rating" integer NOT NULL,
	"description" TEXT NOT NULL,
	CONSTRAINT "reviews_pk" PRIMARY KEY ("review_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "categories" (
	"category_id" serial NOT NULL,
	"category_name" varchar(32) NOT NULL,
	"category_type" varchar(64),
	CONSTRAINT "categories_pk" PRIMARY KEY ("category_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "brands" (
	"brand_id" serial NOT NULL,
	"brand_name" varchar(64) NOT NULL,
	"brand_type" varchar(64) NOT NULL,
	CONSTRAINT "brands_pk" PRIMARY KEY ("brand_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "parameters" (
	"parameters_id" serial NOT NULL,
	"name" varchar(128) NOT NULL,
	"param1" TEXT NOT NULL,
	"param2" TEXT,
	"param3" TEXT,
	"param4" TEXT,
	"param5" TEXT,
	CONSTRAINT "parameters_pk" PRIMARY KEY ("parameters_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "pictures" (
	"product_id" integer NOT NULL,
	"img1" varchar(255) NOT NULL,
	"img2" varchar(255),
	"img3" varchar(255),
	"img4" varchar(255),
	"img5" varchar(255),
	CONSTRAINT "pictures_pk" PRIMARY KEY ("product_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "items" (
	"id" serial NOT NULL,
	"order_id" integer NOT NULL,
	"order_num" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "items_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "userdata" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"name" TEXT NOT NULL,
	"street" TEXT NOT NULL,
	"city" TEXT NOT NULL,
	"zip" TEXT NOT NULL,
	"state" TEXT NOT NULL,
	"country" TEXT NOT NULL,
	CONSTRAINT "userdata_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "orders" ADD CONSTRAINT "orders_fk0" FOREIGN KEY ("user") REFERENCES "users"("id");

ALTER TABLE "products" ADD CONSTRAINT "products_fk0" FOREIGN KEY ("category") REFERENCES "categories"("category_id");
ALTER TABLE "products" ADD CONSTRAINT "products_fk1" FOREIGN KEY ("brand") REFERENCES "brands"("brand_id");
ALTER TABLE "products" ADD CONSTRAINT "products_fk2" FOREIGN KEY ("parameters") REFERENCES "parameters"("parameters_id");

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk0" FOREIGN KEY ("product_id") REFERENCES "products"("product_id");




ALTER TABLE "pictures" ADD CONSTRAINT "pictures_fk0" FOREIGN KEY ("product_id") REFERENCES "products"("product_id");

ALTER TABLE "items" ADD CONSTRAINT "items_fk0" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id");
ALTER TABLE "items" ADD CONSTRAINT "items_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("product_id");

ALTER TABLE "userdata" ADD CONSTRAINT "userdata_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

