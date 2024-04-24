# @darkroom.engineering/codemods

This package provides a codemod script to assist with renaming and updating dependencies in JavaScript projects. It is designed to help migrate from @studio-freight packages to @darkroom.engineering packages.And from @studio-freight/lenis to lenis. Keep in mind that this codemod is not a silver bullet and may require manual intervention in some cases.
Last, this codemod will update the modified dependencies to the latest available versions. If you want to pin the dependencies to a specific version, you will need to do so manually after running the codemod.

## Usage

To run the codemod, use the following command in your project's root directory:

```bash
npx @darkroom.engineering/codemods
```

## The codemod will:

- Detect the package manager (npm, Yarn, or pnpm).

- Update the dependencies in package.json:

- Replace @studio-freight/lenis and @studio-freight/react-lenis with lenis.

- Update other @studio-freight/ dependencies to @darkroom.engineering/.

- Remove @studio-freight packages from the lockfile.
  
- Install the updated dependencies.

- Process JavaScript files, renaming package imports according to the updated dependencies.i.e.:

`@studio-freight/lenis -> lenis`

`@studio-freight/react-lenis -> lenis/react`

`@studio-freight/... -> @darkroom.engineering/...`

## The codemod won't:

-  Make you breakfast

Before running the codemod, it is recommended to backup your project files and ensure your project is under version control.
