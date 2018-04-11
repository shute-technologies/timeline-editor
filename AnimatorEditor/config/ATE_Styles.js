function ATE_Styles() {}
ATE_Styles.Default_Seconds = 10;
ATE_Styles.Default_SubSegments = 10;

ATE_Styles.ScrollbarHeight = 16;
ATE_Styles.GUIHeight = 240;
ATE_Styles.CanvasHeight = ATE_Styles.GUIHeight - ATE_Styles.ScrollbarHeight;
ATE_Styles.BackgroundColor = "#4e4e4e";

// Controls: Styles
ATE_Styles.CStroke_Color = "#6e6e6e";
ATE_Styles.Font_Color = "#f9f9f9";
ATE_Styles.AC_Width = 200;
// Controls: Timeline GUI
ATE_Styles.AC_TimelineHeight = 60;
ATE_Styles.AC_TimelineSegmentWidth = 160;
ATE_Styles.AC_TimelineSubSegmentHeight = 6;
ATE_Styles.AC_TimelineSubSegmentLimitsHeight = 20;
ATE_Styles.AC_TimelineSubSegment_Color = "#f9f9f9";
ATE_Styles.AC_TimelineSubSegment_TextStyle = "bold 9px Arial";
// Controls: Layer GUI
ATE_Styles.AC_TimelineLayerHeight = 30;

ATE_Styles.Timeline = {
    OffsetX: 22,
    OffsetY: 0
};

// Controls: Playback
ATE_Styles.Playback = {
    DefaultTime: 60,
    GUI_Width: 52,
    GUI_Height: 15,
    GUI_TextStyle: "bold 12px Arial",
    GUI_TextColor: "white",
    GUI_BackgroundColor: "red",
    GUI_LineColor: "#FF000066",
    GUI_TextTimeOffset: {
        X: 2,
        Y: -4
    }
};

ATE_Styles.Scrollbar = {
  HorizontalSize: 14,
  VerticalSize: 30
};