import { Flex, Text, VStack, Grid } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Chess from "./components/Chess";

export const App = () => (
  <Flex>
    <VStack>
      <Text>Chess</Text>
      <ColorModeSwitcher />
    </VStack>
    <Chess />
  </Flex>
);
