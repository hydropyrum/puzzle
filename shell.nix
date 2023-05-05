with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "env";
  env = buildEnv { name = name; paths = buildInputs; };
  buildInputs = [
    nodejs
    python39
    python39Packages.requests
    python39Packages.sympy
  ];
}