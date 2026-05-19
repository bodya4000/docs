# Структурна діаграма: фінансова звітність (таблиці та графіки)

Фрагмент статичної моделі для представлення квартальної та аналітичної фінансової інформації у табличному та графічному вигляді, плюс експорт у PDF.

```mermaid
classDiagram
    direction TB

    class QuarterlyPeriod {
        +int year
        +int quarter
    }

    class FinancialIndicator {
        +String code
        +String name
        +String unit
    }

    class IndicatorValue {
        +Decimal amount
        +Date asOfDate
    }

    class DataSnapshot {
        +DateTime capturedAt
        +resolveValue(indicator, period) IndicatorValue
    }

    class ReportTemplate {
        +String templateId
        +String title
        +buildSections() List~ReportSection~
    }

    class FinancialReport {
        +String reportId
        +String status
        +assemble(snapshot, template) void
        +getSections() List~ReportSection~
    }

    class ReportSection {
        +int order
        +String title
    }

    class TableBlock {
        +List~String~ columnKeys
        +List~TableRow~ rows
        +renderGrid() void
    }

    class ChartBlock {
        +ChartType chartType
        +List~ChartSeries~ series
    }

    class TableRow {
        +Map~String,CellValue~ cells
    }

    class ChartSeries {
        +String label
        +List~ChartPoint~ points
    }

    class ChartPoint {
        +String category
        +Decimal value
    }

    class ChartType {
        <<enumeration>>
        LINE
        BAR
        PIE
        AREA
    }

    class PdfExportOptions {
        +bool includeCharts
        +PageOrientation orientation
    }

    class PdfDocument {
        +byte[] bytes
        +String fileName
    }

    class ReportPdfRenderer {
        +render(FinancialReport, PdfExportOptions) PdfDocument
    }

    class DashboardView {
        +String viewId
        +bindReport(FinancialReport) void
        +refresh() void
    }

    FinancialIndicator ..> IndicatorValue : measured by
    DataSnapshot ..> IndicatorValue : contains
    FinancialReport --> QuarterlyPeriod : covers
    FinancialReport --> ReportTemplate : instantiatedFrom
    FinancialReport *-- ReportSection : sections
    ReportSection <|-- TableBlock
    ReportSection <|-- ChartBlock
    TableBlock *-- TableRow : rows
    ChartBlock *-- ChartSeries : series
    ChartBlock --> ChartType : uses
    ChartSeries *-- ChartPoint : points
    ReportPdfRenderer ..> FinancialReport : input
    ReportPdfRenderer ..> PdfExportOptions : input
    ReportPdfRenderer ..> PdfDocument : output
    DashboardView ..> FinancialReport : displays
```

## Короткі пояснення зв’язків

| Елемент | Призначення |
|--------|-------------|
| `DataSnapshot`, `FinancialIndicator`, `IndicatorValue` | Нормалізований зріз чисел за періодом для побудови звіту. |
| `ReportTemplate` | Правила розміщення блоків; `FinancialReport` збирає конкретний екземпляр за кварталом. |
| `TableBlock`, `ChartBlock` | Два види подання одного й того ж змісту в UI та в PDF. |
| `ReportPdfRenderer` | Перетворює вже зібраний `FinancialReport` на `PdfDocument`. |
| `DashboardView` | Компонент інтерфейсу, що відображає звіт користувачу (таблиці + графіки). |
