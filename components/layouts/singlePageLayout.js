export default function SinglePageLayout(Component) {
    function WrappedComponent(props) {
        return (
            <div>
                <Component {...props} />
            </div>
        );
    }

    WrappedComponent.displayName = `SinglePageLayout(${Component.displayName || Component.name || 'Component'})`;

    return WrappedComponent;
}
