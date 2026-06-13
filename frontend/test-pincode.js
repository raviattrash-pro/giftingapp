import PincodeDistance from 'pincode-distance';
const PincodeDistanceClass = PincodeDistance.default || PincodeDistance;
const pd = new PincodeDistanceClass();
const dist = pd.getDistance('829105', '829103');
console.log('Distance:', dist);
