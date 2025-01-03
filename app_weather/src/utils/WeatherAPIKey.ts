import * as SecureStore from 'expo-secure-store';

export async function apiKeyWorks() {
    // Armazenar a API Key antes de retornar os métodos
    await SecureStore.setItemAsync("API_KEY", "14489000e8fa1bc9ceb050d5c55c4bac");

    return {
        getData: async (key: string) => {
            const result = await SecureStore.getItemAsync(key);
            if (result) {
                console.log("Dados recuperados:", result);
                return result;
            } else {
                console.log("Nenhum dado encontrado.");
                return null;
            }
        },
        deleteData: async (key: string) => {
            await SecureStore.deleteItemAsync(key);
        }
    };
}