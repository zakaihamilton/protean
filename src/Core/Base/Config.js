import getConfig from "next/config";

export default function useConfig() {
    const { publicRuntimeConfig } = getConfig();
    return publicRuntimeConfig;
}
