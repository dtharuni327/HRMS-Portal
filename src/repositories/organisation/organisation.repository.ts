import sql from "mssql";
import { db } from "../../config/db";
import { ORGANISATION_SP } from "../../constants/organisation.constants";
import { GetOrganisationQuery } from "../../validations/organisation/getOrganisation.validation";

export const getOrganisationStructureRepo = async (query: GetOrganisationQuery) => {
  const { dept, search } = query;

  const pool = await db;
  const request = new sql.Request(pool);

  request.input("dept",   sql.VarChar, dept   ?? null);
  request.input("search", sql.VarChar, search ?? null);

  return request.execute(ORGANISATION_SP.GET_STRUCTURE);
};
