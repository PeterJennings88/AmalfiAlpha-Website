#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  publish.sh --check
  publish.sh [extra vercel deploy flags]

Options:
  --check     Validate prerequisites without creating a deployment.
  -h, --help  Show this help text.
EOF
}

mode="publish"
extra_args=()

while (($# > 0)); do
  case "$1" in
    --check)
      mode="check"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      extra_args+=("$1")
      shift
      ;;
  esac
done

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_root="$(cd "$script_dir/../../../.." && pwd)"
project_file="$project_root/.vercel/project.json"
vercel_cli_package="${VERCEL_CLI_PACKAGE:-vercel@51.4.0}"
target_domain="${TARGET_DOMAIN:-amalfialpha.com}"

if [[ ! -f "$project_file" ]]; then
  echo "Missing $project_file. This directory is not linked to the expected Vercel project." >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required to run the Vercel CLI." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required to run the Vercel CLI through npx." >&2
  exit 1
fi

project_name="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["projectName"])' "$project_file")"
org_id="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["orgId"])' "$project_file")"

if ! whoami_output="$(npx --yes "$vercel_cli_package" whoami 2>/dev/null)"; then
  echo "Vercel CLI is not logged in. Run 'npx --yes $vercel_cli_package login' first." >&2
  exit 1
fi

echo "Project root: $project_root"
echo "Linked Vercel project: $project_name"
echo "Linked team ID: $org_id"
echo "Logged in as: $whoami_output"
echo "Target public domain: $target_domain"

if [[ "$mode" == "check" ]]; then
  printf 'Ready to publish with: npx --yes %s deploy --prod --yes' "$vercel_cli_package"
  if ((${#extra_args[@]} > 0)); then
    printf ' %q' "${extra_args[@]}"
  fi
  printf '\n'
  exit 0
fi

cd "$project_root"
echo "Starting production deployment..."
npx --yes "$vercel_cli_package" deploy --prod --yes "${extra_args[@]}"
echo "Production deployment finished. If $target_domain is attached to this Vercel project, it should update to the newest production deployment."
