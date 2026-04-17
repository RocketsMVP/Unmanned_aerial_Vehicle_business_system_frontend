import { ref } from "vue";
import { type FormInstance, type FormItemRule } from "element-plus";
import { REG_CODE_FOUR, REG_EMAIL, REG_PHONE, REG_PWD, REG_USER_NAME, REG_CARD_ID, REG_COUP_PHONE, REG_SPACE } from "@/constants";

type Arrayable<T> = T | T[];

export function useFormRules() {
  const patternRules = {
    userName: {
      pattern: REG_USER_NAME,
      message: "用户名输入不合法",
      trigger: "change"
    },
    phone: {
      pattern: REG_PHONE,
      message: "手机号格式不正确",
      trigger: "change"
    },
    coupPhone: {
      pattern: REG_COUP_PHONE,
      message: "手机号格式不正确",
      trigger: "change"
    },
    pwd: {
      pattern: REG_PWD,
      message: "密码格式不正确",
      trigger: "change"
    },
    code: {
      pattern: REG_CODE_FOUR,
      message: "验证码格式不正确",
      trigger: "change"
    },
    email: {
      pattern: REG_EMAIL,
      message: "邮箱格式不正确",
      trigger: "change"
    },
    cardId: {
      pattern: REG_CARD_ID,
      message: "身份证号格式不正确",
      trigger: "change"
    }
  } satisfies Record<string, FormItemRule>;

  const defaultRequiredRule = createRequiredRule("此项为必填项");

  const formRules = {
    userName: [defaultRequiredRule, patternRules.userName],
    phone: [defaultRequiredRule, patternRules.phone],
    pwd: [defaultRequiredRule, patternRules.pwd],
    code: [defaultRequiredRule, patternRules.code],
    email: [defaultRequiredRule, patternRules.email],
    cardId: [defaultRequiredRule, patternRules.cardId]
  } satisfies Record<string, Arrayable<FormItemRule>>;

  function isGetSpace(): FormItemRule {
    console.log("222222222222");
    return {
      required: true,
      pattern: REG_SPACE,
      message: "不允许包含空格",
      trigger: ["change", "blur", "input"]
    };
  }
  function createRequiredRule(message: string): FormItemRule {
    return {
      required: true,
      message,
      trigger: ["change", "blur", "input"]
    };
  }

  function createLengthRule(len: number, type: "max" | "min" = "max", message?: string): FormItemRule {
    const min = type === "min" ? len : undefined;
    const max = type === "max" ? len : undefined;
    const msg = message || `最${type === "min" ? "少" : "多"}输入${len}个字符`;
    return {
      min,
      max,
      message: msg,
      trigger: ["change", "blur", "input"]
    };
  }
  // 判断是否为包含大小写字母数字和特殊符号的字符串，且最少为8位
  function isPwd(): FormItemRule {
    console.log("222222222222");
    return {
      required: true,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
      message: "密码至少包含大、小写字母、数字和特殊符号(@$!%*?&_)，且最少为8位",
      trigger: ["change", "blur", "input"]
    };
  }
  function isPwdsame(formdata): FormItemRule {
    return {
      required: true,
      validator: (rule, value, callback) => {
        console.log("11111111", value, formdata);
        if (value === "") {
          callback(new Error("两次输入密码不能为空"));
        } else if (value !== formdata.new_password) {
          callback(new Error("两次输入密码不一致！"));
        } else {
          // 此处存在逻辑问题，因为无法直接校验val1和val2是否相同
          // 正确的做法应该是使用自定义校验规则，并在表单提交或某个字段校验时比较两个字段的值
          // 此处仅作演示，实际应用中需要改进
          callback();
        }
      },
      message: "两次输入密码不一致！",
      trigger: ["change", "blur", "input"]
    };
  }
  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
    createLengthRule,
    isGetSpace,
    isPwd,
    isPwdsame
  };
}

export function useElForm() {
  const formRef = ref<FormInstance | null>(null);

  async function validate() {
    await formRef.value?.validate();
  }

  async function restoreValidation() {
    formRef.value?.clearValidate();
  }

  return {
    formRef,
    validate,
    restoreValidation
  };
}
