# pkg-monorepo

Integrate WINR games to your application.

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

## Versioning and Publishing Packages

This project uses changesets with Github Actions, all the way through to publishing. Packages are located under the packages directory.

0. Made your changes.
1. Run the command line script `npx changeset`.
2. Select the packages you want to include in the changeset using <kbd>↑</kbd> and <kbd>↓</kbd> to navigate to packages, and <kbd>space</kbd> to select a package. Hit enter when all desired packages are selected.
3. You will be prompted to select a bump type for each selected package. Select an appropriate bump type for the changes made. See [here](https://semver.org/) for information on semver versioning
4. Your final prompt will be to provide a message to go alongside the changeset. This will be written into the changelog when the next release occurs.

After this, a new changeset will be added which is a markdown file with YAML front matter.

```
-| .changeset/
-|-| UNIQUE_ID.md
```

Release pipeline will automatically generate a pull request with the changesets. Once the pull request is approved, the changesets will be merged into the main branch and the packages will be published.

### Contributing

[MIT](/CONTRIBUTING)

### License

[MIT](/LICENSE)
