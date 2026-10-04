type AuthListener = (data: any) => void;

let listener: AuthListener | null = null;

export const registerAuthListener = (fn: AuthListener) => {
  listener = fn;
};

export const notifyAuthUpdated = (data: any) => {
  listener?.(data);
};
