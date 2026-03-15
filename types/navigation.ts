export type RootStackParamList = {
    Home: undefined;
    ProfileEdit: undefined;
    VendorDetails: { vendorId: number };
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
