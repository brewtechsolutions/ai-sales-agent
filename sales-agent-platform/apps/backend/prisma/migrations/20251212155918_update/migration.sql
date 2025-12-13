-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roles" JSONB NOT NULL DEFAULT '[]';
