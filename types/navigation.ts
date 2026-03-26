export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    ProfileSetup: {
        token: string;
        userId: string;
        phoneNo?: string;
        emailId?: string;
    };
    Home: undefined;
    ProfileEdit: undefined;
    VendorDetails: { vendorId: number };
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
