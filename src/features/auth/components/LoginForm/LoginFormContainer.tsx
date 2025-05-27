"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  validateEmailResult,
  validatePasswordResult,
} from "@/lib/utils/validation";
import { getErrorMessage } from "@/lib/utils/error-utils";
import { ApiError } from "@/shared/types/errors";
import { ok } from "neverthrow";
import { LoginFormView } from "./LoginFormView";

/**
 * ログインフォームコンテナー
 *
 * Result型を使用した型安全なログイン処理を実装
 */
export function LoginFormContainer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // メールアドレスのバリデーション
  const emailValidationResult = useMemo(() => {
    if (!email) return ok("");
    return validateEmailResult(email);
  }, [email]);

  // パスワードのバリデーション
  const passwordValidationResult = useMemo(() => {
    if (!password) return ok("");
    return validatePasswordResult(password);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    const emailResult = validateEmailResult(email);
    const passwordResult = validatePasswordResult(password);

    if (emailResult.isErr()) {
      setError(getErrorMessage(emailResult.error));
      return;
    }

    if (passwordResult.isErr()) {
      setError(getErrorMessage(passwordResult.error));
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: emailResult.value,
        password: passwordResult.value,
      });

      if (result?.error) {
        const authError: ApiError = {
          type: "UNAUTHORIZED",
          message: "メールアドレスまたはパスワードが正しくありません",
        };
        setError(getErrorMessage(authError));
        return;
      }

      if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      const authError: ApiError = {
        type: "SERVER_ERROR",
        message: "ログイン処理中にエラーが発生しました",
        statusCode: 500,
      };
      setError(getErrorMessage(authError));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
  };

  return (
    <LoginFormView
      email={email}
      password={password}
      rememberMe={rememberMe}
      isLoading={isLoading}
      error={error}
      emailError={
        emailValidationResult.isErr() && email.length > 0
          ? getErrorMessage(emailValidationResult.error)
          : null
      }
      passwordError={
        passwordValidationResult.isErr() && password.length > 0
          ? getErrorMessage(passwordValidationResult.error)
          : null
      }
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onRememberMeChange={handleRememberMeChange}
      onSubmit={handleSubmit}
    />
  );
}
