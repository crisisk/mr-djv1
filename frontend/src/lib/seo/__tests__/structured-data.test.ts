let structuredDataTest: typeof import("structured-data-testing-tool").structuredDataTest;

beforeAll(async () => {
  ({ structuredDataTest } = await import("structured-data-testing-tool"));
});

describe("Structured Data JSON-LD validation", () => {
  const validateSchema = async (schema: Record<string, unknown>, expectedSchema: string) => {
    if (!structuredDataTest) {
      throw new Error("structuredDataTest was not initialized");
    }

    const result = await structuredDataTest(JSON.stringify(schema), {
      schemas: [expectedSchema],
    });

    expect(result.failed).toHaveLength(0);
    expect(result.schemas).toContain(expectedSchema);
  };

  it("validates organization schema output", async () => {
    const { generateOrganizationSchema } = await import("../index");
    const schema = generateOrganizationSchema();
    await validateSchema(schema, "Organization");
  });

  it("validates local business schema with city data", async () => {
    const { generateLocalBusinessSchema } = await import("../index");
    const schema = generateLocalBusinessSchema({
      city: "Eindhoven",
      province: "Noord-Brabant",
      slug: "eindhoven",
      path: "/dj-in-eindhoven",
    });

    await validateSchema(schema, "LocalBusiness");
  });

  it("validates event schema details", async () => {
    const { generateEventSchema } = await import("../index");
    const schema = generateEventSchema({
      name: "Bruiloft DJ Eindhoven",
      description: "All-inclusive bruiloft DJ pakket in Eindhoven",
      city: "Eindhoven",
      province: "Noord-Brabant",
      startDate: "2025-06-01T18:00:00+02:00",
      endDate: "2025-06-02T01:00:00+02:00",
    });

    await validateSchema(schema, "Event");
  });

  it("validates service schema output", async () => {
    const { generateServiceSchema } = await import("../index");
    const schema = generateServiceSchema({
      serviceName: "DJ Bruiloft Premium",
      description: "Professionele DJ inclusief licht en geluid voor bruiloften",
      serviceType: "EntertainmentService",
    });

    await validateSchema(schema, "Service");
  });
});
