CREATE TYPE "public"."memory_type" AS ENUM('DDR4', 'DDR5');--> statement-breakpoint
CREATE TYPE "public"."motherboard_form_factor" AS ENUM('ATX', 'mATX', 'ITX');--> statement-breakpoint
CREATE TYPE "public"."psu_form_factor" AS ENUM('ATX', 'SFX');--> statement-breakpoint
CREATE TYPE "public"."socket" AS ENUM('AM4', 'AM5', 'LGA1700', 'LGA1851');--> statement-breakpoint
CREATE TYPE "public"."storage_interface" AS ENUM('sata', 'nvme');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text NOT NULL,
	"name" text NOT NULL,
	"price_thb" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"motherboard_form_factors" "motherboard_form_factor"[] NOT NULL,
	"psu_form_factors" "psu_form_factor"[] NOT NULL,
	"max_gpu_length_mm" integer NOT NULL,
	"max_cooler_height_mm" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coolers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text NOT NULL,
	"name" text NOT NULL,
	"price_thb" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"supported_sockets" "socket"[] NOT NULL,
	"height_mm" integer NOT NULL,
	"max_tdp_watts" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cpus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text NOT NULL,
	"name" text NOT NULL,
	"price_thb" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"socket" "socket" NOT NULL,
	"memory_types" "memory_type"[] NOT NULL,
	"cores" integer NOT NULL,
	"threads" integer NOT NULL,
	"base_clock_ghz" real NOT NULL,
	"tdp_watts" integer NOT NULL,
	"has_integrated_gpu" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gpus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text NOT NULL,
	"name" text NOT NULL,
	"price_thb" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"vram_gb" integer NOT NULL,
	"length_mm" integer NOT NULL,
	"slot_width" real NOT NULL,
	"tdp_watts" integer NOT NULL,
	"recommended_psu_watts" integer NOT NULL,
	"pcie8_pin_count" integer DEFAULT 0 NOT NULL,
	"uses12vhpwr" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "motherboards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text NOT NULL,
	"name" text NOT NULL,
	"price_thb" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"socket" "socket" NOT NULL,
	"chipset" text NOT NULL,
	"form_factor" "motherboard_form_factor" NOT NULL,
	"memory_type" "memory_type" NOT NULL,
	"memory_slots" integer NOT NULL,
	"max_memory_gb" integer NOT NULL,
	"m2_slots" integer NOT NULL,
	"sata_ports" integer NOT NULL,
	"pcie_x_16_slots" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "psus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text NOT NULL,
	"name" text NOT NULL,
	"price_thb" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"wattage" integer NOT NULL,
	"form_factor" "psu_form_factor" NOT NULL,
	"efficiency" text NOT NULL,
	"pcie8_pin_count" integer NOT NULL,
	"has_native12vhpwr" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ram_kits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text NOT NULL,
	"name" text NOT NULL,
	"price_thb" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"memory_type" "memory_type" NOT NULL,
	"capacity_gb" integer NOT NULL,
	"module_count" integer NOT NULL,
	"speed_mhz" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_builds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"selection" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storage_drives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text NOT NULL,
	"name" text NOT NULL,
	"price_thb" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"interface" "storage_interface" NOT NULL,
	"capacity_gb" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "saved_builds" ADD CONSTRAINT "saved_builds_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "saved_builds_user_id_idx" ON "saved_builds" USING btree ("user_id");