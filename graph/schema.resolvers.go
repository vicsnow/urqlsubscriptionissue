package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"log"

	"github.com/vicsnow/gqlgen-todos/graph/generated"
	"github.com/vicsnow/gqlgen-todos/graph/model"
)

func (r *mutationResolver) Mock(ctx context.Context) (string, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Hello(ctx context.Context) (string, error) {
	return "HelloWorld", nil
}

func (r *subscriptionResolver) DriveWindowChanged(ctx context.Context, page int, count int) (<-chan []*model.GuiDriveDraw, error) {
	r.Lock()
	defer r.Unlock()
	r.subCount = r.subCount + 1
	go func() {
		<-ctx.Done()
		r.Lock()
		r.subCount = r.subCount - 1
		log.Printf("DRIVE UNSUB \nsub Count: %v", r.subCount)
		r.Unlock()
	}()
	log.Printf("DRIVE SUB %v", r.subCount)
	dr := make(chan []*model.GuiDriveDraw, 1)
	nu := []*model.GuiDriveDraw{}
	for i := 0; i < count; i++ {
		nd := &model.GuiDriveDraw{
			Position: fmt.Sprintf("d"),
		}
		nu = append(nu, nd)
	}
	dr <- nu
	return dr, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
