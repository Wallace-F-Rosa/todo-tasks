-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
