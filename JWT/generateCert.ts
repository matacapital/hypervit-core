import { CertGenerationException } from "./CertGenerationException.ts";
import { File } from "./deps.ts";

export const generateCert = async () => {
  try {
    const cmd = new Deno.Command("openssl", { args: ["version", "-a"] });
    await cmd.output();
  } catch {
    throw new CertGenerationException("Check if openssl is installed");
  }

  // get private key location
  let privateKey = Deno.env.get("JWT_PRIVATE_KEY");
  if (!privateKey) {
    privateKey = "config/jwt/pkcs8.key";
    const envFile = new File(".env.example");
    envFile.ensure();
    envFile.addContent(`JWT_PRIVATE_KEY="${privateKey}"`);
  }

  const privateKeyFile = new File(privateKey);
  const privateKeyDir = privateKeyFile.getDirectory();
  privateKeyDir.ensure();

  try {
    const cmd = new Deno.Command("openssl", {
      args: [
        `genpkey`,
        "-out",
        privateKeyFile.getPath(),
        `-algorithm`,
        `RSA`,
        `-pkeyopt`,
        `rsa_keygen_bits:2048`,
      ],
    });
    await cmd.output();
  } catch (e) {
    throw new CertGenerationException(e.message);
  }
};
