import Form from "@/components/form";
import { updateSite } from "@/lib/actions";
import db from "@/lib/db";

type SiteSettingsDomainsParams = Promise<{ id: string }>;
export default async function SiteSettingsDomains(props: {
  params: SiteSettingsDomainsParams;
}) {
  const params = await props.params
  const data = await db.query.sites.findFirst({
    where: (sites, { eq }) => eq(sites.id, decodeURIComponent(params.id)),
  });

  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Subdomain"
        description="The subdomain for your site."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "subdomain",
          type: "text",
          defaultValue: data?.subdomain!,
          placeholder: "subdomain",
          maxLength: 32,
        }}
        handleSubmit={updateSite}
      />
      <Form
        title="Custom Domain"
        description="The custom domain for your site."
        helpText="Please enter a valid domain."
        inputAttrs={{
          name: "customDomain",
          type: "text",
          defaultValue: data?.customDomain!,
          placeholder: "yourdomain.com",
          maxLength: 64,
          pattern: "^[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}$",
        }}
        handleSubmit={updateSite}
      />
    </div>
  );
}
