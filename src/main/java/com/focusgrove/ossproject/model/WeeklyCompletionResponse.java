package com.focusgrove.ossproject.model;

import java.util.List;

public class WeeklyCompletionResponse {
    private List<String> labels;
    private List<Integer> completionRates;

    public WeeklyCompletionResponse(List<String> labels, List<Integer> completionRates) {
        this.labels = labels;
        this.completionRates = completionRates;
    }

    public List<String> getLabels() {
        return labels;
    }

    public void setLabels(List<String> labels) {
        this.labels = labels;
    }

    public List<Integer> getCompletionRates() {
        return completionRates;
    }

    public void setCompletionRates(List<Integer> completionRates) {
        this.completionRates = completionRates;
    }
}
