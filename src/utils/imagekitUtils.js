import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: "public_bo3tmsjZu1U+zkRw5V6dZsQFGYI=",
    privateKey: "private_NcBYoWjobkly0XOGXzsJ+L7G6cU=",
    urlEndpoint: "https://ik.imagekit.io/korsinemi"
});

export async function fileUpload(file, setMessages) {
    try {
        const response = await imagekit.upload({
            file: file,
            fileName: file.name
        });

        return response.url;
    } catch (error) {
        console.error('Error al guardar la imagen:', error);
        setMessages((prev) => [...prev, { type: 'error', text: 'Error al guardar la imagen' }]);
        setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
        return null;
    }
}

export async function deleteImage(url, setMessages) {
    try {
        const fileName = url.split('/').pop();
        const files = await imagekit.listFiles({
            searchQuery: `name="${fileName}"`
        });

        if (files.length === 0) {
            setMessages((prev) => [...prev, { type: 'error', text: 'La imagen no se encontró en el CDN' }]);
            setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
            throw new Error('No se encontró el archivo con el nombre proporcionado');
        }

        const imageId = files[0].fileId;
        await imagekit.deleteFile(imageId);
        setMessages((prev) => [...prev, { type: 'success', text: 'Imagen eliminada exitosamente del CDN' }]);
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        setMessages((prev) => [...prev, { type: 'error', text: 'Error al eliminar la imagen' }]);
        setTimeout(() => setMessages((prev) => prev.slice(1)), 6000);
        throw error;
    }
}