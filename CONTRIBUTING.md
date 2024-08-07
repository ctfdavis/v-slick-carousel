# Contributing to `V Slick Carousel`

As the creators and maintainers of this project, we want to ensure that `v-slick-carousel` continues to grow. Therefore, we would like to encourage everyone to contribute to this library.

## Code contributions

Here is a quick guide to making code contributions to the library.

1. Fork and clone the repo to your local machine: `git clone https://github.com/YOUR_GITHUB_USERNAME/v-slick-carousel.git`

2. Create a new branch from `main` with an appropriate name for a new feature or an issue you want to work on: `git checkout -b YOUR-MEANINGFUL-BRANCH-NAME`
   a. We encourage that you prefix your branch with `TYPE/`, e.g. `feat/` in `feat/some-interesting-feature` and `fix/` in `fix/#23` or `fix/some-bug`. Below are some example types for your reference:

   - `feat`: feature
   - `fix`: bug fix
   - `docs`: documentation
   - `test`: tests

3. Install packages by running:

```bash
pnpm install
```

4. Make the necessary changes:

   - The library code resides in `packages/v-slick-carousel/lib`. For manual testing, use the accompanying app located in `packages/v-slick-carousel/src`. Please remember not to include any changes in `packages/v-slick-carousel/src` since the application code is designated for development purposes only.

   - The documentation code is housed in `packages/docs`.

5. If you have added a code that should be tested, ensure the test suite still passes.

```bash
pnpm test
```

6. We encourage and highly recommend that you to write some unit tests to cover as much of your code as possible. This will help the review process and the long-term maintenance of the project.

7. Ensure the lint process passes without errors.

```bash
pnpm lint
```

8. Ensure the build process passes.

```bash
pnpm build
```

9. Push your branch: `git push -u origin YOUR-MEANINGFUL-BRANCH-NAME`

10. Submit a pull request to the upstream `v-slick-carousel` repository.

11. Give a descriptive title and describe your changes.

## Coding style

Please follow the coding style of the project. V Slick Carousel uses `eslint` and `prettier`. If possible, install and enable their respective plugins in your editor to get real-time feedback. Linting can be run manually with the following command: `pnpm lint:fix`; and formatting: `pnpm format`.

## Github Issues

We use GitHub issues to track public bugs. Please ensure your description is
clear and has sufficient instructions to be able to reproduce the issue.

## License

By contributing your code to the `v-slick-carousel` GitHub repository, you agree to license your contribution under the MIT license.
