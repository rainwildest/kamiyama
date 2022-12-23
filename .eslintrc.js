module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  // settings: {
  //   react: {
  //     version: "detect"
  //   }
  // },
  env: {
    browser: true,
    amd: true,
    node: true
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],

  rules: {
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "no-var": "warn",
    "prefer-const": "warn", //首选const
    "new-parens": "warn", //new时必须加小括号
    "no-cond-assign": "error", //禁止在条件表达式中使用赋值语句  Bad: if(x = 0) 正确if(x == 0)
    "no-floating-decimal": "error", //禁止省略浮点数中的0 .5 3.
    "init-declarations": "off", //声明时必须赋初值
    "@typescript-eslint/no-var-requires": "off",
    "no-empty": "off",
    eqeqeq: ["error", "always"]
  }
};
