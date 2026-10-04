// src/components/schedule/MeetingIcons.tsx

type IconProps = {
  className?: string;
};

export const ZoomIcon = ({ className }: IconProps) => (
  <img
    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiPjxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjIwIiBmaWxsPSIjMjE5NmYzIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTI5LDMxSDE0Yy0xLjY1NywwLTMtMS4zNDMtMy0zVjE3aDE1YzEuNjU3LDAsMywxLjM0MywzLDNWMzF6Ii8+PHBvbHlnb24gZmlsbD0iI2ZmZiIgcG9pbnRzPSIzNywzMSAzMSwyNyAzMSwyMSAzNywxNyIvPjwvc3ZnPg=="
    alt="Zoom"
    className={className}
  />
);

export const TeamsIcon = ({ className }: IconProps) => (
  <img
    src="https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/product-icon-M365-Teams-48x48?resMode=sharp2&op_usm=1.5,0.65,15,0&wid=48&hei=48&qlt=100&fit=constrain"
    alt="Microsoft Teams"
    className={className}
  />
);

export const GoogleMeetIcon = ({ className }: IconProps) => (
  <img
    src="https://ssl.gstatic.com/calendar/images/conferenceproviders/logo_meet_2020q4_192px.svg"
    alt="Google Meet"
    className={className}
  />
);