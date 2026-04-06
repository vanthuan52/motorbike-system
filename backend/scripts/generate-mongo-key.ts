/// <reference types="node" />
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';


/**
 * Generates a cryptographically secure keyfile for MongoDB replica set internal authentication.
 *
 * When --auth is enabled alongside --replSet, MongoDB requires all replica set members to
 * share a common keyfile secret so they can authenticate with each other internally.
 *
 * Requirements (enforced by MongoDB):
 *   - Content length between 6 and 1024 characters
 *   - File permission must be 400 (owner read-only)
 *   - All replica set members must use the IDENTICAL keyfile
 *
 * @see https://www.mongodb.com/docs/manual/core/security-internal-authentication/#keyfiles
 */
class MongoKeyfileGenerator {
  private readonly outputPath: string;

  constructor(outputPath: string) {
    this.outputPath = outputPath;
  }

  /**
   * Generates a cryptographically secure keyfile for MongoDB replica set authentication.
   * Uses 756 random bytes → base64 → ~1008 characters (within MongoDB's 6–1024 limit).
   *
   * @param force - Overwrite an existing keyfile. Defaults to false.
   * @returns Absolute path of the generated keyfile.
   */
  generate(force: boolean = false): string {
    const outputDir = path.dirname(this.outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    if (fs.existsSync(this.outputPath) && !force) {
      console.log(`\n⚠️  Keyfile already exists at: ${this.outputPath}`);
      console.log('   Use --force to overwrite (i.e. rotate the secret).');
      return this.outputPath;
    }

    // 756 random bytes → base64 ≈ 1008 chars; safely within MongoDB's 6–1024 char limit
    const keyContent = crypto.randomBytes(756).toString('base64');
    fs.writeFileSync(this.outputPath, keyContent, { encoding: 'utf8' });

    try {
      // chmod 400: MongoDB refuses to start if the keyfile is world-readable.
      // On Windows this is a no-op — Docker corrects the permission inside the container
      // via the `chmod 400` step in the mongod startup command.
      fs.chmodSync(this.outputPath, 0o400);
    } catch {
      // Windows does not support Unix-style chmod — silently skip
    }

    const action = force ? 'Rotated' : 'Generated';

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ MongoDB keyfile ${action.toLowerCase()} successfully!`);
    console.log(`${'='.repeat(60)}`);
    console.log(`\n📁 Location : ${this.outputPath}`);
    console.log(`   Size     : ${keyContent.length} characters (base64)`);
    console.log(`\n⚠️  Security reminders:`);
    console.log(`   • Listed in .gitignore (*.key) — do NOT commit this file`);
    console.log(`   • Rotating the key requires restarting ALL replica set members`);
    console.log(`\n🐳 Docker usage:`);
    console.log(`   Dev     (docker-compose.dev.yml)     — already wired, mount via volumes`);
    console.log(`   Staging (docker-compose.staging.yml) — also wired, copy file to server`);
    console.log(`   Production                           — provision via secrets manager`);
    console.log(`\n📋 Next steps:`);
    console.log(`   Dev     : docker compose --env-file .env.development -f docker-compose.dev.yml up -d`);
    console.log(`   Staging : scp docker/mongo/mongo.key user@server:/app/docker/mongo/mongo.key`);
    console.log(`             docker compose --env-file .env.staging -f docker-compose.staging.yml up -d`);
    console.log(`\n`);

    return this.outputPath;
  }
}

function main() {
  const argv = process.argv.slice(2);
  const force = argv.includes('--force');

  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(`
Usage: npm run generate:mongo-key [-- [options]]

Generates a MongoDB keyfile (docker/mongo/mongo.key) for replica set
internal authentication. Required when MongoDB runs with both --replSet
and --auth flags (development environment).

NOT needed for staging/production — those environments do not enable
MongoDB authentication (--auth is absent in docker-compose.staging.yml).

Options:
  --force    Overwrite an existing keyfile (rotate the shared secret).
             All replica set members must be restarted after rotation.
  --help     Show this help message.

Examples:
  # First-time setup
  npm run generate:mongo-key

  # Rotate the keyfile secret
  npm run generate:mongo-key -- --force
    `);
    process.exit(0);
  }

  const outputPath = path.join(process.cwd(), 'docker', 'mongo', 'mongo.key');
  const generator = new MongoKeyfileGenerator(outputPath);
  generator.generate(force);
}

main();
