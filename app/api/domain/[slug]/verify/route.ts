import {
  getConfigResponse,
  getDomainResponse,
  verifyDomain,
} from "@/lib/domains";
import { DomainVerificationStatusProps } from "@/lib/types";
import { NextResponse } from "next/server";

type GetParams = Promise<{ slug: string }>;

export async function GET(
  _req: Request,
  props: { params: GetParams },
) {
  const params = await props.params
  const domain = decodeURIComponent(params.slug);
  let status: DomainVerificationStatusProps = "Valid Configuration";

  const [domainJson, configJson] = await Promise.all([
    getDomainResponse(domain),
    getConfigResponse(domain),
  ]);

  if (domainJson?.error?.code === "not_found") {
    // domain not found on Vercel project
    status = "Domain Not Found";

    // unknown error
  } else if (domainJson.error) {
    status = "Unknown Error";

    // if domain is not verified, we try to verify now
  } else if (!domainJson.verified) {
    status = "Pending Verification";
    const verificationJson = await verifyDomain(domain);

    // domain was just verified
    if (verificationJson && verificationJson.verified) {
      status = "Valid Configuration";
    }
  } else if (configJson.misconfigured) {
    status = "Invalid Configuration";
  } else {
    status = "Valid Configuration";
  }

  return NextResponse.json({
    status,
    domainJson,
  });
}
