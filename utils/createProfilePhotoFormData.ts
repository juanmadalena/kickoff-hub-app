export const createProfilePhotoFormData = (uri: any, idUser: string) => {

    const fileName = uri.split('/').pop();
    const fileType = fileName.split('.').pop();
    const formData = new FormData();
    
    formData.append('image', {
      name: fileName,
      uri,
      type: `image/${fileType}`,
    });

    formData.append('idUser', idUser);

    return formData;
};