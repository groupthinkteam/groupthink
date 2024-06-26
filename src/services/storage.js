import { firbaseStorage } from './firebase'

export const StoreFileToStorage = (path, file, metadata, callback) => {
    var spaceRef = firbaseStorage().ref(path).put(file, metadata);
    spaceRef.on(firbaseStorage.TaskEvent.STATE_CHANGED,
        function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firbaseStorage.TaskState.SUCCESS:
                    console.log("Upload is Success")
                    break;
                case firbaseStorage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firbaseStorage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                default:
                    break;
            }
        },
        function (error) {
            switch (error.code) {
                case 'storage/unauthorized':
                    console.log(" User doesn't have permission to access the object")
                    break;

                case 'storage/canceled':
                    console.log("Storage Cancelled")
                    break;


                case 'storage/unknown':
                    console.log(" Unknown error occurred, inspect \n", error.serverResponse)
                    break;
                default :
                    break;
            }
        }, // or 'state_changed'
        () => {
            spaceRef.snapshot.ref.getDownloadURL()
                .then((url) =>
                    spaceRef.snapshot.ref.getMetadata()
                        .then((data) => {
                            callback({ url: url, metadata: data })
                        })
                        .catch((err) => console.log("Error in Metadata", err))
                )
                .catch((err) => console.log("Error in DownLoadURL", err))
        }
    );
}

export const GetFileFromStorage = (path, callback) => {
    var spaceRef = firbaseStorage().ref(path)
    spaceRef.listAll()
        .then((dir) => {
            //-------Files Exist-------
            if (dir.items.length > 0) {
                dir.items.forEach((fileRef, _) => {
                    fileRef.getMetadata()
                        .then((data) => {
                            fileRef.getDownloadURL()
                                .then((url) => {
                                    callback(prev => ([
                                        ...prev,
                                        { metadata: data, url: url }]
                                    ))
                                })
                        })
                })
            }
            else {
                console.log("No Files Exist")
            }
        })
        .catch(error => {
            console.log(error);
        });
}