import { connectDb } from "./lib/db";
import { Provider } from "./lib/models/provider";

async function main() {
  await connectDb();
  const count = await Provider.countDocuments();
  console.log("Total providers:", count);
  
  const providers = await Provider.find({}).lean();
  console.log("Providers:", providers.map(p => ({ name: p.name, category: p.category })));
  
  process.exit(0);
}

main().catch(console.error);
