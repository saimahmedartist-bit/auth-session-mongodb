-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshTokens" TEXT[] DEFAULT ARRAY[]::TEXT[];
