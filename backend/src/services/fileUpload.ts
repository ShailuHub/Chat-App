// Import AWS
import AWS from "aws-sdk";

// Create a function that will upload a file to S3
const uploadToS3 = (data: Buffer, filename: string): Promise<string> => {
  // Authentication requirements
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const I_AM_USER = process.env.I_AM_USER;
  const SECRET_KEY = process.env.I_AM_USER_KEY;

  // Create an authenticated AWS object
  const awsObj = new AWS.S3({
    accessKeyId: I_AM_USER,
    secretAccessKey: SECRET_KEY,
  });

  // Check if data.buffer is defined and not empty
  if (!data || !data.buffer) {
    return Promise.reject(new Error("Invalid file data"));
  }
  // Create the parameters that we have to pass to the AWS object
  const params: AWS.S3.Types.PutObjectRequest = {
    Bucket: BUCKET_NAME!,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  // Return a promise
  return new Promise<string>((resolve, reject) => {
    awsObj.upload(
      params,
      (err: Error | null, response: AWS.S3.ManagedUpload.SendData) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(response.Location);
        }
      }
    );
  });
};

export { uploadToS3 };
