import { colorModeStore } from "@/shared/libs/preferences";
import { useLocalStore } from "@/shared/libs/local-store";

const useColorMode = () => useLocalStore(colorModeStore);

export default useColorMode;
