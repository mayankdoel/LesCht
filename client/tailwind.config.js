export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E53935",
        "primary-hover": "#D32F2F",
        "primary-light": "#FFCDD2",

        bg: {
          main: "#FFFFFF",
          secondary: "#FAFAFA",
          sidebar: "#F5F5F5",
          hover: "#FDECEC"
        },

        text: {
          primary: "#1A1A1A",
          secondary: "#666666",
          muted: "#9E9E9E",
          onPrimary: "#FFFFFF"
        },

        border: "#E0E0E0",
        divider: "#EEEEEE",

        status: {
          online: "#4CAF50",
          away: "#FFC107",
          offline: "#BDBDBD"
        },

        notification: "#E53935"
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },

      fontSize: {
        xs: ["12px", { lineHeight: "1.4" }],
        sm: ["13px", { lineHeight: "1.4" }],
        base: ["14px", { lineHeight: "1.4" }],
        lg: ["16px", { lineHeight: "1.4" }],
        xl: ["18px", { lineHeight: "1.4" }]
      },

      borderRadius: {
        sm: "10px",
        md: "12px",
        lg: "16px",
        xl: "20px"
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.05)"
      },

      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px"
      },

      transitionTimingFunction: {
        smooth: "ease"
      },

      transitionDuration: {
        fast: "200ms"
      }
    }
  },

  plugins: [
    function ({ addComponents }) {
      addComponents({

        // Sidebar Icon
        ".sidebar-icon": {
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666666",
          transition: "all 0.2s ease"
        },
        ".sidebar-icon:hover": {
          backgroundColor: "#FDECEC",
          color: "#E53935"
        },
        ".sidebar-icon-active": {
          backgroundColor: "#E53935",
          color: "#FFFFFF"
        },

        // Chat List Item
        ".chat-item": {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px",
          borderRadius: "12px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          color: "#666666"
        },
        ".chat-item:hover": {
          backgroundColor: "#FDECEC",
          color: "#1A1A1A"
        },
        ".chat-item-active": {
          backgroundColor: "#FFEBEE",
          color: "#E53935",
          fontWeight: "500"
        },

        // Avatar
        ".avatar": {
          width: "40px",
          height: "40px",
          borderRadius: "9999px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textTransform: "uppercase",
          fontWeight: "bold",
          color: "#FFFFFF"
        },
        ".avatar-status": {
          position: "absolute",
          bottom: "0",
          right: "0",
          width: "12px",
          height: "12px",
          borderRadius: "9999px",
          border: "2px solid white"
        },

        // Message Bubbles
        ".msg": {
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: "16px",
          fontSize: "14px"
        },
        ".msg-sent": {
          backgroundColor: "#E53935",
          color: "#FFFFFF",
          marginLeft: "auto",
          borderBottomRightRadius: "4px"
        },
        ".msg-received": {
          backgroundColor: "#F5F5F5",
          color: "#1A1A1A",
          marginRight: "auto",
          borderTopLeftRadius: "4px"
        },

        // Input Bar
        ".input-bar": {
          height: "56px",
          padding: "0 16px",
          borderTop: "1px solid #EEEEEE",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "#FFFFFF"
        },

        // Buttons
        ".btn": {
          borderRadius: "10px",
          padding: "10px 16px",
          fontWeight: "500",
          transition: "all 0.2s ease",
          cursor: "pointer"
        },
        ".btn-primary": {
          backgroundColor: "#E53935",
          color: "#FFFFFF",
          border: "none"
        },
        ".btn-primary:hover": {
          backgroundColor: "#D32F2F"
        },
        ".btn-primary:disabled": {
          backgroundColor: "#FFCDD2",
          cursor: "not-allowed"
        },
        ".btn-ghost": {
          backgroundColor: "transparent",
          color: "#666666"
        },
        ".btn-ghost:hover": {
          backgroundColor: "#FDECEC",
          color: "#E53935"
        },

        // Card
        ".card": {
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid #EEEEEE"
        }

      });
    }
  ]
};
