/*
  Warnings:

  - A unique constraint covering the columns `[shop_domain]` on the table `Shop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Shop_shop_domain_key" ON "Shop"("shop_domain");
