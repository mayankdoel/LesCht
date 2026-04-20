export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F97316", // Orange 500
        "primary-hover": "#EA580C", // Orange 600
        "primary-light": "#FFEDD5", // Orange 100 for some text

        bg: {
          main: "#171717",
          secondary: "#262626",
          sidebar: "#121212",
          hover: "#333333"
        },

        text: {
          primary: "#F3F4F6", // Gray 100
          secondary: "#9CA3AF", // Gray 400
          muted: "#6B7280", // Gray 500
          onPrimary: "#FFFFFF"
        },

        border: "#374151", // Gray 700
        divider: "#3F3F46", // Zinc 700

        status: {
          online: "#22C55E",
          away: "#EAB308",
          offline: "#6B7280"
        },

        notification: "#F97316"
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
        soft: "0 4px 20px rgba(0,0,0,0.5)"
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
          color: "#9CA3AF",
          transition: "all 0.2s ease"
        },
        ".sidebar-icon:hover": {
          backgroundColor: "#333333",
          color: "#F97316"
        },
        ".sidebar-icon-active": {
          backgroundColor: "#F97316",
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
          color: "#9CA3AF"
        },
        ".chat-item:hover": {
          backgroundColor: "#333333",
          color: "#F3F4F6"
        },
        ".chat-item-active": {
          backgroundColor: "#331608", // Very dark orange tint
          color: "#F97316",
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
          border: "2px solid #171717" // match bg-main
        },

        // Message Bubbles
        ".msg": {
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: "16px",
          fontSize: "14px"
        },
        ".msg-sent": {
          backgroundColor: "#F97316",
          color: "#FFFFFF",
          marginLeft: "auto",
          borderBottomRightRadius: "4px"
        },
        ".msg-received": {
          backgroundColor: "#262626", // bg-secondary
          color: "#F3F4F6",
          marginRight: "auto",
          borderTopLeftRadius: "4px"
        },

        // Input Bar
        ".input-bar": {
          height: "56px",
          padding: "0 16px",
          borderTop: "1px solid #374151", // text-muted/border
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "#171717"
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
          backgroundColor: "#F97316",
          color: "#FFFFFF",
          border: "none"
        },
        ".btn-primary:hover": {
          backgroundColor: "#EA580C"
        },
        ".btn-primary:disabled": {
          backgroundColor: "#7C2D12",
          color: "#9CA3AF",
          cursor: "not-allowed"
        },
        ".btn-ghost": {
          backgroundColor: "transparent",
          color: "#9CA3AF"
        },
        ".btn-ghost:hover": {
          backgroundColor: "#333333",
          color: "#F97316"
        },

        // Card
        ".card": {
          backgroundColor: "#171717",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          border: "1px solid #374151"
        }

      });
    }
  ]
};
