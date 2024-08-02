import examples from "../src/examples"

export default {
  paths() {
    return [
      {
        params: { id: "index" },
      },
      ...Object.keys(examples).map((id) => ({
        params: { id },
      })),
    ];
  },
};
